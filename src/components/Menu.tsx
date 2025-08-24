interface Props {
  setPage: (page: string) => void;
  onSearch: (keyword: string) => void;
}

function Menu({ setPage, onSearch }: Props) {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    onSearch(payload.search as string);
    setPage("search");
  };
  return (
    <>
      <nav className="navbar navbar-expand-sm sticky-top bg-body-secondary">
        <div className="container-fluid">
          <a className="navbar-brand">Homebrew</a>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                onClick={() => {
                  setPage("home");
                }}
                className="nav-link active"
                aria-current="page"
                href="#"
              >
                Home
              </a>
            </li>

            <li className="nav-item">
              <form onSubmit={handleSubmit} className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  name="search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Menu;
