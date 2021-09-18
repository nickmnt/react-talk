import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

export default observer(function ActivityDashboard() {
  const {activityStore} = useStore();
  const {loadActivities, activityRegistry} = activityStore;

  useEffect(() => {
    if(activityRegistry.size <= 1)
      loadActivities();  
  }, [loadActivities, activityRegistry]);


  if(activityStore.loadingInitial) {
    return <LoadingComponent content='Loading activities...' />
  }

  return (
    <Grid className="baseSettings">
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
        <h2>Activity Filters</h2>
      </Grid.Column>
    </Grid>
  );
});