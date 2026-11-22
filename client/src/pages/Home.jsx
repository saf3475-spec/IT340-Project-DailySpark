import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

// Sample content for now. Later milestones fill these cards from the database and APIs.
export default function Home() {
  const { user } = useAuth();
  const action = (label) => (user ? null : <Link to="/login">{label}</Link>);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Today’s Spark</h1>
          <p>
            {user
              ? `Welcome back, ${user}.`
              : 'Six new posts every day. Log in to comment or bookmark.'}
          </p>
        </div>
      </div>

      <div className="card-grid">
        <article className="card card-quote">
          <h2 className="card-label">Quote of the day</h2>
          <blockquote>“Well begun is half done.”</blockquote>
          <cite>Aristotle</cite>
          <div className="card-foot"><span>12 comments</span>{action('Join the discussion')}</div>
        </article>

        <article className="card card-image">
          <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Placeholder illustration for the image of the day">
            <rect width="320" height="240" fill="var(--tint)" />
            <circle cx="220" cy="82" r="34" fill="var(--accent)" />
            <path d="M0 190 L70 110 L120 160 L180 95 L260 175 L320 130 V240 H0Z" fill="var(--blue)" opacity=".55" />
            <path d="M0 215 L90 150 L150 200 L230 140 L320 205 V240 H0Z" fill="var(--blue)" />
          </svg>
          <div className="card-body">
            <h2 className="card-label">Image of the day</h2>
            <p>A featured picture with its title and credit will appear here.</p>
            <div className="card-foot"><span>7 comments</span>{action('Bookmark')}</div>
          </div>
        </article>

        <article className="card card-fact">
          <h2 className="card-label">Fun fact</h2>
          <p>Honey found in ancient Egyptian tombs was still safe to eat after thousands of years.</p>
          <div className="card-foot"><span>3 comments</span></div>
        </article>

        <article className="card card-word">
          <h2 className="card-label">Word of the day</h2>
          <div className="word">petrichor<small>noun</small></div>
          <p>The pleasant smell that follows rain on dry ground.</p>
          <div className="card-foot"><span>5 comments</span></div>
        </article>

        <article className="card card-history">
          <h2 className="card-label">On this day in history</h2>
          <p><strong>1904:</strong> The first line of the New York City subway opens to the public.</p>
          <div className="card-foot"><span>4 comments</span></div>
        </article>

        <article className="card card-question">
          <h2 className="card-label">Question of the day</h2>
          <div className="question-text">What’s a skill you picked up by accident?</div>
          <span className="suggested-by">Suggested by @marisol_k</span>
          <div className="card-foot"><span>18 answers</span>{action('Add yours')}</div>
        </article>
      </div>
    </div>
  );
}
