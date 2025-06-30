import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/styles/reports.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../../assets/images/strat-sync-logo.png';

const ReportsPage = () => {
  const [profesores, setProfesores] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_BASE}/api/reportes/profesores-horarios`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('La respuesta no es un array:', data);
          throw new Error('Formato de respuesta inesperado');
        }

        setProfesores(data);
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };

    fetchProfesores();
  }, []);

  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGeneratePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      let firstPage = true;

      // Colores profesionales
      const primaryColor = [9, 25, 255];
      const secondaryColor = [245, 247, 250];
      const accentColor = [41, 128, 185];
      const headerHeight = 30;
      const margin = 15;

      // Convertir logo a base64
      const toBase64 = (url) => fetch(url).then(res => res.blob()).then(blob =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
      );

      const logoBase64 = await toBase64(logoImg);
      
      // Función para formatear fecha
      const formatDate = (date) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return {
          dateStr: `${dayName}, ${day} de ${monthName} de ${year}`,
          timeStr: `${hours}:${minutes}`
        };
      };

      const now = new Date();
      const { dateStr, timeStr } = formatDate(now);

      // Generar nombre de archivo
      let fileName = `Horarios_${now.toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;

      if (seleccionados.length === 1) {
        const prof = profesores.find(p => p.id === seleccionados[0]);
        if (prof) {
          const cleanName = prof.profesor.replace(/[^\w\sáéíóúÁÉÍÓÚñÑüÜ]/gi, '').replace(/\s+/g, '_');
          fileName = `Horario_${cleanName}_${now.toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;
        }
      }

      seleccionados.forEach((id, index) => {
        const prof = profesores.find(p => p.id === id);
        if (!prof) return;

        if (!firstPage) doc.addPage('landscape');
        firstPage = false;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Encabezado con fondo
        doc.setFillColor(...secondaryColor);
        doc.rect(0, 0, pageWidth, headerHeight, 'F');
        
        // Logo
        doc.addImage(logoBase64, 'PNG', margin, 4, 25, 25);

        // Información de reporte - tamaño de fuente reducido para mejor ajuste
        doc.setFontSize(9);
        doc.setTextColor(100);
        
        // Texto alineado a la derecha con dos líneas
        doc.text("Reporte Académico - StratSync", 272, 15, { align: 'right' });
        doc.text(`Fecha: ${dateStr}`, 270, 20, { align: 'right' });
        doc.text(`Hora: ${timeStr}`, 279, 25, { align: 'right' });

        // Título principal
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont(undefined, 'bold');
        doc.text(`Horario del Profesor: ${prof.profesor}`, margin, headerHeight + 15);

        // Línea decorativa
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(0.5);
        doc.line(margin, headerHeight + 20, pageWidth - margin, headerHeight + 20);

        // Preparar datos de la tabla
        const columnas = [
          { header: 'Materia', dataKey: 'materia' },
          { header: 'Categoría', dataKey: 'categoria' },
          { header: 'Horario', dataKey: 'horario' },
          { header: 'Descripción', dataKey: 'descripcion' }
        ];

        const filas = prof.horarios.map(h => ({
          materia: h.materia,
          categoria: h.categoria,
          horario: h.horario.replace(/(\d{2}:\d{2}):\d{2}/g, '$1'),
          descripcion: h.descripcion || ''
        }));

        const tableWidth = pageWidth - 2 * margin;

        // Generar tabla
        autoTable(doc, {
          startY: headerHeight + 25,
          columns: columnas,
          body: filas,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 4,
            valign: 'middle',
            lineColor: [200, 200, 200],
            lineWidth: 0.25,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 11
          },
          alternateRowStyles: {
            fillColor: secondaryColor
          },
          columnStyles: {
            materia: { cellWidth: tableWidth * 0.20, fontStyle: 'bold' },
            categoria: { cellWidth: tableWidth * 0.15 },
            horario: { cellWidth: tableWidth * 0.20 },
            descripcion: {
              cellWidth: tableWidth * 0.45,
              cellPadding: 3
            }
          },
          margin: { horizontal: margin }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(100);
          
          // Línea decorativa
          doc.setDrawColor(...accentColor);
          doc.setLineWidth(0.3);
          doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
          
          // Número de página
          doc.text(
            `Página ${i} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }
      });

      doc.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar PDF');
    }
  };

  return (
    <MainLayout>
      <div className="reports-container">
        <h1>🗂️ Reporte de Horarios</h1>
        <p className="subtitle">Selecciona los profesores cuyos horarios deseas imprimir.</p>

        <table className="tabla-horarios">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Profesor</th>
              <th>Total de materias</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(profesores) && profesores.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(p.id)}
                    onChange={() => toggleSeleccion(p.id)}
                  />
                </td>
                <td>{p.profesor}</td>
                <td>{p.horarios.length}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="report-footer">
          <span>{seleccionados.length} profesor(es) seleccionado(s)</span>
          <button
            className="btn-generar"
            onClick={handleGeneratePDF}
            disabled={seleccionados.length === 0}
          >
            📄 Generar PDF
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;