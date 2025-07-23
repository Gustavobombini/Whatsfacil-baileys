import groupchatinternal from "../../models/Groups";
import Setting from "../../models/Setting";

const ListSettingsService = async (): Promise<{ settings: Setting[]; groups: any[] }> => {
  const settings = await Setting.findAll();
  const groups = await groupchatinternal.findAll();

  return { settings, groups };
};

export default ListSettingsService;
