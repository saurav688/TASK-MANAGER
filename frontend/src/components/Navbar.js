import React from 'react';
import './Navbar.css';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const Navbar = ({ title, onSearch, user, onMenuToggle }) => {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="navbar">
      <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
        <MenuIcon />
      </button>
      <span className="navbar-title">{title}</span>

      <div className="navbar-search">
        <span className="navbar-search-icon"><SearchIcon /></span>
        <input
          type="search"
          placeholder="Search tasks..."
          onChange={e => onSearch(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="navbar-right">
        <div className="navbar-avatar" title={user?.name} aria-label={`User: ${user?.name}`}>
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
