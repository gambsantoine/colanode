import { BreadcrumbItem } from '@colanode/ui/components/layouts/containers/breadcrumb-item';
import { defaultIcons } from '@colanode/ui/lib/assets';

export const WorkspaceApiKeysBreadcrumb = () => {
  return (
    <BreadcrumbItem
      id="api-keys"
      avatar={defaultIcons.settings}
      name="Api keys"
    />
  );
};
