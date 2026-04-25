export const Tag = ({ children }) => (
  <div className="sa-tag">
    <i className="fas fa-bolt" style={{ fontSize: 10 }}></i>
    {children}
  </div>
);

export const BtnP = ({ children, onClick, style }) => (
  <button className="sa-btn-p" onClick={onClick} style={style}>
    {children}
  </button>
);

export const BtnO = ({ children, onClick }) => (
  <button className="sa-btn-o" onClick={onClick}>
    {children}
  </button>
);
