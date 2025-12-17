import { ChooseAccounts } from "@/components/scheduler/ChooseAccounts";
import { useSchedulerForm } from "./SchedulerFormContext";
import { User } from "@/types/user";

export const AccountSelector = ({ client }: { client: User }) => {
  const { state, dispatch } = useSchedulerForm();

  return (
    <ChooseAccounts
      client={client}
      selectedAccountIds={state.selectedAccountIds}
      onChange={(ids: string[]) => {
        dispatch({ type: "SET_SELECTED_ACCOUNTS", payload: ids });
      }}
    />
  );
};
