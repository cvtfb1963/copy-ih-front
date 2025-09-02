import NavBar from "../Navbar/NavBar";

export const AnyRoleRoute = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="main-content-area">
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
