import { TabItem } from '@colanode/ui/components/layouts/tabs/tab-item';
import { defaultIcons } from '@colanode/ui/lib/assets';

export const WorkspaceApiKeysTab = () => {
  return (
    <TabItem id="api-keys" avatar={defaultIcons.settings} name="Api keys" />
  );
};
