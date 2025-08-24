import type { ReactNode } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import Handler from "./Handler";
import { ADVERSARIES, PAGES } from "../App";

class Page {
  private readonly id: string;
  private readonly title: string;
  readonly render: () => ReactNode;
  constructor(id: string, title: string, render: () => ReactNode) {
    this.id = id;
    this.title = title;
    this.render = render;
  }

  renderNav() {
    if (this.title === "") {
      return null;
    }
    return (
      <Nav.Link
        key={this.id}
        onClick={() => {
          PAGES.setPage(this.id);
        }}
        href={"#" + this.id}
      >
        {this.title}
      </Nav.Link>
    );
  }
}

export default class PageHandler extends Handler {
  private page: string = "";

  constructor() {
    super("");
  }

  init(setFunc: Function, page: string = "") {
    super.init(setFunc);
    this.page = page;
  }

  exists(id: string) {
    return Object.keys(this.data).includes(id);
  }

  getPage(id: string) {
    if (this.exists(id)) {
      return this.data[id];
    }
    return null;
  }

  getCurrentPage() {
    if (this.exists(this.page)) {
      return this.data[this.page];
    }
    return null;
  }

  createPage(id: string, title: string, render: () => ReactNode) {
    this.data[id] = new Page(id, title, render);
  }

  setPage(id: string) {
    if (this.exists(id)) {
      this.page = id;
    }
    if (this.setFunc) {
      this.reload();
    }
  }

  render() {
    const page = this.getCurrentPage();
    if (page) {
      return page.render();
    }
    return <h1>Error</h1>;
  }

  renderNavbar() {
    if (this.initialized()) {
      return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">BLLK</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {Object.values(this.data).map((p) => {
                  return p.renderNav();
                })}
              </Nav>
              <Form onSubmit={ADVERSARIES.search} className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  name="keyword"
                />
                <Button type="submit" variant="outline-success">
                  Search
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }
  }
}
