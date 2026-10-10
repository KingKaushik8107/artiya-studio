import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  return (
    <section className="container section">
      <div className="section-heading">
        <span className="eyebrow">
          <Search size={15} /> PAGE NOT FOUND
        </span>

        <h1>Oops! This page wandered away.</h1>

        <p>
          The page you're looking for doesn't exist or may have been moved.
          Let's help you find something lovely instead.
        </p>

        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;