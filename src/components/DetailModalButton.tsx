import { useState, useEffect, useCallback } from 'react';
import Mermaid from '@theme/Mermaid';
import type { DetailSlide } from './detailSlides';

type Props = {
  slides: DetailSlide[];
  eyebrow: string;
  label: string;
};

export default function DetailModalButton({ slides, eyebrow, label }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count);
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, count, close]);

  const slide = slides[index];

  return (
    <>
      <button type="button" className="ai-detail-btn" onClick={() => { setIndex(0); setOpen(true); }}>
        <span className="ai-detail-btn__eyebrow">{eyebrow}</span>
        <span className="ai-detail-btn__label">{label}</span>
        <span className="ai-detail-btn__cta">자세히 보기 <b>→</b></span>
      </button>

      {open && (
        <div className="ai-modal-overlay" onClick={close}>
          <div className="ai-modal" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ai-modal__close" onClick={close} aria-label="닫기">✕</button>
            <div className="ai-modal__head">
              <span className="ai-modal__no">{slide.no}</span>
              <div className="ai-modal__titles">
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
              </div>
              <span className="ai-modal__counter">{index + 1} / {count}</span>
            </div>
            <div className="ai-modal__body">
              {slide.problem && <p className="ai-modal__problem">{slide.problem}</p>}
              {slide.diagram && <div className="ai-modal__diagram"><Mermaid value={slide.diagram} /></div>}
              {slide.tree && <pre className="ai-modal__mono">{slide.tree}</pre>}
              {slide.code && <pre className="ai-modal__mono ai-modal__code">{slide.code}</pre>}
              <ul className="ai-modal__points">
                {slide.points.map((p) => (
                  <li key={p.label}><b>{p.label}</b> {p.desc}</li>
                ))}
              </ul>
            </div>
            <div className="ai-modal__nav">
              <button type="button" className="ai-modal__arrow" onClick={() => go(index - 1)} aria-label="이전">←</button>
              <div className="ai-modal__dots">
                {slides.map((s, i) => (
                  <button type="button" key={s.no} className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`${i + 1}번 슬라이드`} />
                ))}
              </div>
              <button type="button" className="ai-modal__arrow" onClick={() => go(index + 1)} aria-label="다음">→</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
