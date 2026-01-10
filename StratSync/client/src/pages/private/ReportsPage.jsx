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
    setHorarios([
      {
        id: 1,
        profesor: 'Juan Pérez',
        grupo: '3A',
        materia: 'Matemáticas',
        horario: 'Lunes 8:00 - 10:00',
      },
      {
        id: 2,
        profesor: 'Ana López',
        grupo: '2B',
        materia: 'Física',
        horario: 'Martes 10:00 - 12:00',
      },
      {
        id: 3,
        profesor: 'Luis Gómez',
        grupo: '1C',
        materia: 'Química',
        horario: 'Miércoles 9:00 - 11:00',
      },
    ]);
  }, []);

  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 5. GENERACIÓN DEL PDF
  const handleGeneratePDF = () => {
        const doc = new jsPDF();

        const columnas = ['Profesor', 'Materia', 'Grupo', 'Horario'];
        const filas = seleccionados.map((id) => {
            const h = horarios.find((x) => x.id === id);
            return [h.profesor, h.materia, h.grupo, h.horario];
        });

        doc.text('Horarios seleccionados', 14, 15);

       // autoTable(doc, {
       //     startY: 20,
       //     head: [columnas],
       //     body: filas,
       // });

        doc.save('horarios-profesores.pdf');
    };


  // 6. INTERFAZ DEL COMPONENTE
  return (
    <MainLayout>
      <div className="reports-container">
        <h1>Impresión de Horarios</h1>

        <div className="lista-horarios">
          {horarios.map((h) => (
            <div key={h.id} className="horario-item">
              <input
                type="checkbox"
                checked={seleccionados.includes(h.id)}
                onChange={() => toggleSeleccion(h.id)}
              />
              <span>{`${h.profesor} - ${h.materia} (${h.grupo})`}</span>git branch
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;