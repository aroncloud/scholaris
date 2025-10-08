/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react';
import { Search, Save, Download, Users, BookOpen, Calendar, CheckCircle } from 'lucide-react';

const GradeEntryInterface = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState<Record<string, string>>({});

  const courses = [
    { id: 'MATH-101', name: 'Mathématiques Fondamentales', students: 24 },
    { id: 'PHYS-201', name: 'Physique Générale', students: 31 },
    { id: 'INFO-301', name: 'Algorithmique Avancée', students: 18 }
  ];

  const sessions = [
    { id: 'exam1', name: 'Examen Partiel 1', weight: 30, date: '2024-03-15' },
    { id: 'exam2', name: 'Examen Partiel 2', weight: 30, date: '2024-04-20' },
    { id: 'final', name: 'Examen Final', weight: 40, date: '2024-05-25' }
  ];

  const students = [
    { id: 'STU001', name: 'Martin Dubois', email: 'martin.dubois@univ.fr', group: 'A1' },
    { id: 'STU002', name: 'Sophie Laurent', email: 'sophie.laurent@univ.fr', group: 'A1' },
    { id: 'STU003', name: 'Thomas Bernard', email: 'thomas.bernard@univ.fr', group: 'A2' },
    { id: 'STU004', name: 'Emma Moreau', email: 'emma.moreau@univ.fr', group: 'A2' },
    { id: 'STU005', name: 'Lucas Petit', email: 'lucas.petit@univ.fr', group: 'B1' },
    { id: 'STU006', name: 'Camille Roux', email: 'camille.roux@univ.fr', group: 'B1' }
  ];

  const handleGradeChange = (studentId: any, value: any) => {
    setGrades(prev => ({
      ...prev,
      [`${studentId}-${selectedSession}`]: value
    }));
  };

  const getGrade = (studentId: any) => {
    return grades[`${studentId}-${selectedSession}`] || '';
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Saisie des Notes</h1>
              <p className="text-sm text-gray-600 mt-1">Interface de gestion des évaluations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-8">
        {/* Selection Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Cours
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un cours</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.name} ({course.students} étudiants)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Évaluation
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCourse}
              >
                <option value="">Sélectionner une évaluation</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.name} - {session.weight}% ({session.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCourseData && selectedSessionData && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {selectedCourseData.name} - {selectedSessionData.name}
                  </p>
                  <p className="text-sm text-blue-700">
                    Coefficient: {selectedSessionData.weight}% | {selectedCourseData.students} étudiants inscrits
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        {selectedCourse && selectedSession && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Liste des Étudiants</h2>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Groupe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note (/20)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const grade = getGrade(student.id);
                    const numericGrade = parseFloat(grade);
                    const hasGrade = grade !== '';
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {student.group}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={grade}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="--"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasGrade ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              numericGrade >= 10 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {numericGrade >= 10 ? 'Validé' : 'Échec'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              En attente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {filteredStudents.length} étudiants | {Object.keys(grades).length} notes saisies
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Aperçu
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Valider les Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeEntryInterface;