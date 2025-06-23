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
      const doc = new jsPDF();
      let firstPage = true;

      // Convertir imagen a base64
      const toBase64 = (url) =>
        fetch(url)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          );

      const logoBase64 = await toBase64(logoImg);

      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;

      let fileName;
      if (seleccionados.length === 1) {
        const prof = profesores.find(p => p.id === seleccionados[0]);
        const cleanName = prof?.profesor.replace(/[^\w\sáéíóúÁÉÍÓÚñÑüÜ]/gi, '').replace(/\s+/g, ' ');
        fileName = `Horario ${cleanName} ${dateStr}.pdf`;
      } else {
        fileName = `Horarios ${dateStr}.pdf`;
      }

      seleccionados.forEach((id, index) => {
        const prof = profesores.find(p => p.id === id);
        if (!prof) return;

        if (!firstPage) doc.addPage();
        firstPage = false;

        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 50;
        const x = (pageWidth - imgWidth) / 2;
        doc.addImage(logoBase64, 'PNG', x, 5, imgWidth, 30);

        doc.setFontSize(16);
        doc.text(`Horario de: ${prof.profesor}`, 14, 40);

        const columnas = ['Materia', 'Categoría', 'Horario', 'Comentarios'];
        

          
          const filas = prof.horarios.map(h => [
            `${h.materia}\n${h.descripcion || 'Introducción'}`, // texto principal + texto debajo
            h.categoría,
            h.horario
          ]);


        
        autoTable(doc, {
          startY: 50,
          head: [columnas],
          body: filas,
          theme: 'grid',
          headStyles: {
            fillColor: [9, 25, 255],
            textColor: 255,
            fontStyle: 'bold'
          }
        });
      });

      doc.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF');
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
