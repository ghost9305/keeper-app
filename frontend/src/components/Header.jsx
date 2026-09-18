import HighlightIcon from "@mui/icons-material/Highlight";

function Header(props) {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
      {props.user && (
        <div className="header-user">
          <span>{props.user.name || props.user.email}</span>
          <button onClick={props.onLogout}>Log Out</button>
        </div>
      )}
    </header>
  );
}

export default Header;
