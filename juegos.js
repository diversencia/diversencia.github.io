css
/* ===== TARJETAS JUEGOS MEJORADAS ===== */
.cards-wrapper {
  max-width: 1200px;
  margin: 0 auto 4rem;
  text-align: left;
}

.cards-wrapper h3 {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #4db7c3, #86AE87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-weight: 600;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.juego-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px;
  padding: 2rem 1.5rem 1.5rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(77, 183, 195, 0.1);
  position: relative;
  overflow: hidden;
}

.juego-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 60px rgba(77, 183, 195, 0.2);
}

.juego-img {
  width: 100%;
  max-height: 160px;
  margin: 0 auto 1.5rem;
  display: block;
  border-radius: 16px;
  object-fit: contain;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.juego-titulo {
  font-size: 1.3rem;
  margin: 0 0 0.5rem;
  color: #2c5f6b;
  font-weight: 600;
  line-height: 1.3;
}

.juego-edad {
  font-weight: 600;
  margin: 0 0 0.8rem;
  color: #86AE87;
  font-size: 1rem;
  background: rgba(134, 174, 135, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
}

/* ⭐ ESTRELLAS DIFICULTAD VISIBLES */
.juego-dificultad {
  font-size: 1.2rem;
  color: #e37c3a;
  margin: 0.8rem 0 1.2rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(227, 124, 58, 0.1), rgba(227, 124, 58, 0.05));
  padding: 0.6rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(227, 124, 58, 0.2);
}

.juego-desc-corta {
  font-family: 'Glacial Indifference', 'Quicksand', sans-serif;
  font-size: 0.98rem;
  color: #555;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.juego-toggle {
  margin-top: auto;
  background: linear-gradient(135deg, #4db7c3, #3a9aa5);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.5rem;
  cursor: pointer;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(77, 183, 195, 0.3);
  transition: all 0.3s;
}

.juego-toggle:hover {
  background: linear-gradient(135deg, #e37c3a, #d96b2e);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(227, 124, 58, 0.4);
}

.juego-detalles {
  margin-top: 1.5rem;
  font-size: 0.92rem;
  color: #444;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

.det-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #e7f6f8, #d1ecf1);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  margin: 0.3rem 0.5rem 0.3rem 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #2c5f6b;
  box-shadow: 0 4px 15px rgba(77, 183, 195, 0.2);
  border: 1px solid rgba(77, 183, 195, 0.3);
  transition: all 0.3s;
}

.det-badge:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(77, 183, 195, 0.4);
}

/* 🔥 NUEVO: ACCESS+ VERDE */
.link-access-badge {
  background: linear-gradient(135deg, #28a745, #218838) !important;
  color: white !important;
  min-width: 44px;
  height: 44px;
  justify-content: center;
  font-size: 1.2rem;
}

.access-badge {
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  color: white !important;
  font-weight: 700 !important;
}

.juego-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1.2rem 0;
}

.juego-tag {
  font-size: 0.82rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
}

.juego-tag--visual { background: #ffe9e0; color: #e37c3a; border: 1px solid rgba(227, 124, 58, 0.3); }
.juego-tag--auditiva { background: #e8f4ff; color: #4db7c3; border: 1px solid rgba(77, 183, 195, 0.3); }
.juego-tag--motora { background: #e6f2ea; color: #86AE87; border: 1px solid rgba(134, 174, 135, 0.3); }
.juego-tag--cognitiva { background: #f3ecff; color: #7b61ff; border: 1px solid rgba(123, 97, 255, 0.3); }
.juego-tag--tea { background: #fff6d9; color: #d4a017; border: 1px solid rgba(212, 160, 23, 0.3); }

.juego-link {
  display: inline-block;
  margin-top: 1rem;
  background: linear-gradient(135deg, #e37c3a, #d96b2e);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.juego-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(227, 124, 58, 0.4);
}

/* RESPONSIVE ORIGINAL */
@media (max-width: 1200px) {
  .cards-container { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
}

@media (max-width: 768px) {
  .cards-container { grid-template-columns: 1fr; gap: 1.5rem; }
  .filtros-juegos { 
    grid-template-columns: 1fr; 
    gap: 1rem; 
    padding: 1.2rem; 
  }
  #limpiar-filtros { grid-column: span 1; }
  .juego-card { padding: 1.5rem 1.2rem; }
}

@media (max-width: 480px) {
  .cards-wrapper h3 { font-size: 1.8rem; text-align: center; }
  .juego-img { max-height: 140px; }
}

