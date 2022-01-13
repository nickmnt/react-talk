import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Switch from "@mui/material/Switch/Switch";
import { FormikTouched, useField } from "formik";
import { ChangeEvent, useEffect } from "react";
import { GroupMemberPermissions } from "../../../app/models/chat";

export interface ToggleFieldProps {
  name: string;
  label: string;
  values: GroupMemberPermissions;
  touched: FormikTouched<GroupMemberPermissions>;
  setFieldValue: any;
}

// toggle field converts yes or no to true or false
export const ToggleField = (props: ToggleFieldProps) => {
  const [field] = useField<boolean>(props);

  const onChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if(props.name === 'sendMessages' && checked === false) {
      props.setFieldValue('sendMedia', false);
    }
    if(props.name === 'sendMedia' && checked === true) {
      props.setFieldValue('sendMessages', true)
    }
    field.onChange(event);
  }

  // use `field` but override onChange
  return (
    <ListItem
      secondaryAction={<Switch {...field} checked={field.value} onChange={onChange} />}
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
