import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Switch from "@mui/material/Switch/Switch";
import { useField } from "formik";

export interface ToggleFieldProps {
  name: string;
  label: string;
}

// toggle field converts yes or no to true or false
export const ToggleField = (props: ToggleFieldProps) => {
  const [field] = useField<boolean>(props);

  // use `field` but override onChange
  return (
    <ListItem
      secondaryAction={<Switch {...field} checked={field.value} />}
      sx={{ paddingRight: "1rem" }}
    >
      <ListItemButton>
        <ListItemText
          primaryTypographyProps={{ fontSize: "1.6rem" }}
          primary={props.label}
        />
      </ListItemButton>
    </ListItem>
  );
};
