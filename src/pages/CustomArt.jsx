import { Heart, Palette } from 'lucide-react';

function CustomArt() {
  return (
    <section className="container section">
      <div className="section-heading">
        <span className="eyebrow">
          <Palette size={15} /> MADE JUST FOR YOU
        </span>

        <h1>Turn your memories into art.</h1>

        <p>
          Celebrate your favourite people with personalised family
          portraits and couple artwork, thoughtfully created by Artiya Studio.
        </p>

        <a
          href="https://www.instagram.com/artiya._.studio/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <Heart size={17} />
          Enquire on Instagram
        </a>
      </div>
    </section>
  );
}

export default CustomArt;