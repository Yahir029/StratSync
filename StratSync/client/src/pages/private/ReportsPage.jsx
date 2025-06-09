import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import '../../assets/styles/reports.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
  const [profesores, setProfesores] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    setProfesores([
      {
        id: 1,
        profesor: 'Juan Pérez',
        horarios: [
          { grupo: '3A', materia: 'Matemáticas', horario: 'Lunes 8:00 - 10:00' },
          { grupo: '3A', materia: 'Álgebra', horario: 'Miércoles 10:00 - 12:00' },
        ]
      },
      {
        id: 2,
        profesor: 'Ana López',
        horarios: [
          { grupo: '2B', materia: 'Física', horario: 'Martes 10:00 - 12:00' },
        ]
      },
      {
        id: 3,
        profesor: 'Luis Gómez',
        horarios: [
          { grupo: '1C', materia: 'Química', horario: 'Miércoles 9:00 - 11:00' },
        ]
      }
    ]);
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

      doc.autoTable({
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