import { Field, FieldProps, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props {
  profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {
    const [editing, setEditing] = useState(false);
  
    return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile.displayName}`}
          />
          <Button
            floated="right"
            content={editing ? "Cancel" : "Edit Profile"}
            color="blue"
            onClick={() => setEditing(!editing)}
          />
        </Grid.Column>
        <Grid.Column width={16}>
            {editing ? (
                <>
                    <Formik
                        initialValues={{ body: "" }}
                        onSubmit={() => console.log('submit')}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                        <Form className="ui form">
                            <Field name="body">
                                {(props: FieldProps) => (
                                    <></>
                                )
                                }
                            </Field>
                        </Form>
                        )}
                    </Formik>
                </>
            ) : (
                <>
                    <Header content={profile.displayName} />
                    <div style={{ whiteSpace: "pre-line" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, consequatur non tempore nulla perferendis expedita laborum incidunt perspiciatisaperiam praesentium voluptatum ad labore. Recusandae optio nesciunt dignissimos sapiente suscipit id.</div>
                </>
            )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
