import React, { useState } from 'react';
import {
  Mic, BookOpen, UserCheck, Sparkles, Code, Play, CheckCircle2,
  ChevronDown, ChevronUp, Send, HelpCircle, Award, Volume2, RotateCcw
} from 'lucide-react';
import { TECHNICAL_SUBJECTS, TECHNICAL_QUESTIONS, HR_QUESTIONS } from '../data/questionBank';
import apiClient from '../services/apiClient';

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState("technical"); // technical, hr, mock
  const [selectedSubject, setSelectedSubject] = useState(TECHNICAL_SUBJECTS[0]);
  const [expandedId, setExpandedId] = useState(null);

  // Mock Interview State
  const [mockSubject, setMockSubject] = useState("Data Structures & Algorithms");
  const [mockSessionActive, setMockSessionActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const filteredTechQuestions = TECHNICAL_QUESTIONS.filter(q => q.subject === selectedSubject);

  // Filter mock questions for the selected mock subject
  const mockQuestions = TECHNICAL_QUESTIONS.filter(q => q.subject === mockSubject);

  const startMockInterview = () => {
    setMockSessionActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setEvaluationResult(null);
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const submitMockAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    const currentQ = mockQuestions[currentQuestionIndex] || TECHNICAL_QUESTIONS[0];
    const keyTerms = currentQ.keyConcepts || ["algorithm", "time complexity", "optimization"];

    try {
      const response = await apiClient.post('/api/ai/interview/evaluate', {
        question: currentQ.question,
        answer: userAnswer,
        keyConcepts: keyTerms,
        subject: mockSubject
      });
      setEvaluationResult(response);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer using AI.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < mockQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer("");
      setEvaluationResult(null);
    } else {
      alert("Mock Interview Complete! Excellent work practicing.");
      setMockSessionActive(false);
    }
  };

  return (
    <div className="section-container animate-fade-in">
      {/* Header */}
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <Mic className="icon-indigo" size={26} />
            <h2 className="section-title">Interview Preparation & AI Mock Simulator</h2>
          </div>
          <p className="section-subtitle">
            Master core computer science subjects, practice STAR behavioral HR questions, and evaluate your responses in real-time with the AI Mock Interviewer.
          </p>
        </div>

        <div className="prep-tabs-group flex-items">
          <button
            className={`btn-filter ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            <Code size={15} /> Technical Q&A
          </button>
          <button
            className={`btn-filter ${activeTab === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveTab('hr')}
          >
            <UserCheck size={15} /> HR & STAR Tips
          </button>
          <button
            className={`btn-filter ${activeTab === 'mock' ? 'active-green' : ''}`}
            onClick={() => setActiveTab('mock')}
          >
            <Sparkles size={15} /> AI Mock Interview
          </button>
        </div>
      </div>

      {/* 1. TECHNICAL QUESTIONS TAB */}
      {activeTab === 'technical' && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Subject Pills */}
          <div className="subject-pills-wrap flex-items">
            {TECHNICAL_SUBJECTS.map(subj => (
              <button
                key={subj}
                className={`subject-pill ${selectedSubject === subj ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="questions-list" style={{ marginTop: '1.25rem' }}>
            {filteredTechQuestions.map(q => {
              const isExpanded = expandedId === q.id;
              return (
                <div key={q.id} className="question-card glass-card">
                  <div
                    className="question-header flex-between"
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  >
                    <div className="flex-items" style={{ gap: '0.75rem' }}>
                      <span className={`difficulty-badge diff-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                      <h3 className="question-title">{q.question}</h3>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {isExpanded && (
                    <div className="question-body animate-fade-in">
                      <div className="answer-box">
                        <strong className="text-emerald">Model Answer:</strong>
                        <p style={{ marginTop: '0.3rem', whitespace: 'pre-line' }}>{q.answer}</p>
                      </div>

                      {q.codeSnippet && (
                        <div className="code-box" style={{ marginTop: '0.75rem' }}>
                          <pre><code>{q.codeSnippet}</code></pre>
                        </div>
                      )}

                      <div className="key-concepts flex-items" style={{ marginTop: '0.75rem' }}>
                        <span className="hint-text">Key Concepts:</span>
                        {q.keyConcepts.map((kc, idx) => (
                          <span key={idx} className="skill-chip-sm skill-chip-matched">{kc}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HR QUESTIONS TAB */}
      {activeTab === 'hr' && (
        <div className="hr-questions-grid" style={{ marginTop: '1.5rem' }}>
          {HR_QUESTIONS.map(hr => (
            <div key={hr.id} className="hr-card glass-card">
              <div className="hr-card-header flex-between">
                <span className="pill-badge">{hr.category}</span>
                <span className="hint-text">STAR Strategy</span>
              </div>
              <h3 className="hr-question" style={{ margin: '0.75rem 0' }}>{hr.question}</h3>

              <div className="star-tip-box glass-card">
                <div className="flex-items" style={{ gap: '0.4rem', color: '#f59e0b' }}>
                  <Sparkles size={16} />
                  <strong>STAR Framework Tip:</strong>
                </div>
                <p style={{ marginTop: '0.2rem', fontSize: '0.9rem' }}>{hr.starTip}</p>
              </div>

              <div className="sample-answer-box" style={{ marginTop: '0.75rem' }}>
                <strong className="text-emerald">High-Scoring Sample Answer:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{hr.sampleAnswer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. AI MOCK INTERVIEW TAB */}
      {activeTab === 'mock' && (
        <div className="mock-interview-container" style={{ marginTop: '1.5rem' }}>
          {!mockSessionActive ? (
            <div className="mock-intro-card glass-card text-center" style={{ padding: '2.5rem' }}>
              <div className="brand-icon-box gradient-bg" style={{ margin: '0 auto 1rem auto', width: '54px', height: '54px' }}>
                <Mic size={28} className="icon-white" />
              </div>
              <h2>Interactive AI Mock Interviewer</h2>
              <p className="subtitle" style={{ maxWidth: '600px', margin: '0.5rem auto 1.5rem auto' }}>
                Practice simulated placement interviews with dynamic audio/text feedback, concept keyword matching, and real-time accuracy scoring.
              </p>

              <div className="flex-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <label>Select Mock Domain:</label>
                <select
                  value={mockSubject}
                  onChange={(e) => setMockSubject(e.target.value)}
                  className="glass-card"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {TECHNICAL_SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary btn-lg" onClick={startMockInterview}>
                <Play size={18} /> Start Mock Interview Session
              </button>
            </div>
          ) : (
            <div className="mock-session-box glass-card animate-fade-in">
              <div className="session-header flex-between">
                <span className="pill-badge">
                  Question {currentQuestionIndex + 1} of {mockQuestions.length} ({mockSubject})
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => setMockSessionActive(false)}>
                  End Session
                </button>
              </div>

              {/* Current Question */}
              <div className="mock-question-display glass-card" style={{ marginTop: '1rem' }}>
                <span className="hint-text">Interviewer Question:</span>
                <h3>{mockQuestions[currentQuestionIndex]?.question}</h3>
              </div>

              {/* Response Input */}
              <div className="mock-response-area" style={{ marginTop: '1.25rem' }}>
                <div className="flex-between">
                  <label>Your Voice or Typed Answer:</label>
                  <button
                    type="button"
                    className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={handleSpeechInput}
                  >
                    <Mic size={14} /> {isListening ? 'Listening...' : 'Voice Input (Speech)'}
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Speak or type your interview answer in detail..."
                  className="mock-textarea"
                ></textarea>

                <div className="flex-between" style={{ marginTop: '0.75rem' }}>
                  <span className="hint-text">
                    Tip: Explain core concept, time/space complexity, and edge cases.
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={submitMockAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                  >
                    {isEvaluating ? "Evaluating with AI..." : <><Send size={16} /> Evaluate Answer</>}
                  </button>
                </div>
              </div>

              {/* AI Evaluation Report */}
              {evaluationResult && (
                <div className="eval-result-card glass-card animate-fade-in" style={{ marginTop: '1.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <span className="hint-text">AI Evaluation Scorecard</span>
                      <h3 className="text-emerald">Technical Accuracy: {evaluationResult.accuracyScore}%</h3>
                      <span className="pill-badge" style={{ marginTop: '0.2rem' }}>
                        {evaluationResult.confidenceRating}
                      </span>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={nextQuestion}>
                      Next Question →
                    </button>
                  </div>

                  <p className="eval-feedback-text" style={{ marginTop: '0.75rem' }}>
                    {evaluationResult.feedback}
                  </p>

                  <div className="skills-split-grid" style={{ marginTop: '0.75rem' }}>
                    <div>
                      <span className="section-micro-title text-emerald">✓ Covered Key Concepts:</span>
                      <div className="skills-badge-wrap" style={{ marginTop: '0.2rem' }}>
                        {evaluationResult.matchedConcepts.length > 0 ? (
                          evaluationResult.matchedConcepts.map((c, i) => (
                            <span key={i} className="skill-chip-sm skill-chip-matched">{c}</span>
                          ))
                        ) : (
                          <span className="text-muted text-sm">None detected</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="section-micro-title text-amber">⚠️ Missing Key Concepts:</span>
                      <div className="skills-badge-wrap" style={{ marginTop: '0.2rem' }}>
                        {evaluationResult.missingConcepts.length > 0 ? (
                          evaluationResult.missingConcepts.map((c, i) => (
                            <span key={i} className="skill-chip-sm skill-chip-missing">{c}</span>
                          ))
                        ) : (
                          <span className="text-emerald text-sm">All key concepts covered!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
