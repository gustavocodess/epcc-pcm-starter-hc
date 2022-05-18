import { safeLsGet, safeLsSet } from "src/utils/safeLS";

export const getViewedList = () => {
  const list = safeLsGet("pviewed");

  if (list) {
    return JSON.parse(list);
  }
  return [];
};

export const setViewedList = (data: any) => {
  const currentList: Array<any> = getViewedList();

  for (let index = 0; index < currentList.length; index++) {
    const element = currentList[index];
    if (element.id === data.id) {
      currentList.splice(index, 1)
    }
  }

  currentList.unshift(data);

  if (currentList.length > 6) {
    currentList.pop();
  }

  safeLsSet("pviewed", JSON.stringify(currentList));
};
