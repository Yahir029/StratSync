import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/styles/reports.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
  const [profesores, setProfesores] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
  const fetchProfesores = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reportes/profesores-horarios');
      const data = await response.json();
      setProfesores(data);
    } catch (error) {
      console.error('Error al obtener los profesores:', error);
      // Manejo de error (opcional)
      setProfesores([
        // Datos de ejemplo en caso de error
        {
          id: 1,
          profesor: 'Juan Pérez',
          horarios: [
            { grupo: '3A', materia: 'Matemáticas', horario: 'Lunes 8:00 - 10:00' },
          ]
        }
      ]);
    }
  };

  fetchProfesores();
}, []);


  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    seleccionados.forEach((id, index) => {
      const prof = profesores.find(p => p.id === id);
      if (!prof) return;

      if (index !== 0) doc.addPage(); // Añade nueva hoja si no es el primero

      doc.text(`Horario de: ${prof.profesor}`, 14, 15);

      const columnas = ['Materia', 'Grupo', 'Horario'];
      const filas = prof.horarios.map(h => [h.materia, h.grupo, h.horario]);

      autoTable(doc, {
        startY: 20,
        head: [columnas],
        body: filas,
      });
    });

    doc.save('horarios-por-profesor.pdf');
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
            {profesores.map((p) => (
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