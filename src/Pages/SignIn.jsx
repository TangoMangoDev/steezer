import { Link as NavLink } from "react-router-dom";
import { getMoonInfo, Login } from '../utils/authUtils';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © Stateezer @ '}
      <Link color="inherit" href="https://stateezer.com/">
        Mindfirm
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}