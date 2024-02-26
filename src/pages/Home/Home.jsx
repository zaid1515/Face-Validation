import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
function Home() {
  const navigate = useNavigate();

  const totalMarks = 100; 
  const totalTimeRemaining = '1 hour';

  const questions = [
    {
      id: 1,
      question: 'Question 1: Climbing Stairs',
      marks: 50 
    },
    {
      id: 2,
      question: `Question 2: Bob's Birthday`,
      marks: 50 
    }
  ];

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Hiring Test Questions</h1>
      <div className="info">
        <p>Total Time Remaining: {totalTimeRemaining}</p>
        <p>Total Marks: {totalMarks}</p>
      </div>
      <h2 className="questions-title">Questions:</h2>
      {questions.map(q => (
        <div key={q.id} className="question">
          <p>{q.question}</p>
          <p className="marks">Marks: {q.marks}</p>
        </div>
      ))}
      <div className="btnss">
      <button className="start-button">Start Test</button>
     
      </div>
      <div className="btnss">
           <button className="back-button" onClick={goBack}>Back</button>
      </div>
    </div>
  );
}

export default Home;
