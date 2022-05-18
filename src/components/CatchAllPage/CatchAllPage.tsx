import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { BuilderComponent, builder, Builder, BuilderContent } from "@builder.io/react";
import Loading from '../Loading/Loading';

export const CatchAllPage = () => {
  const [pageJson, setPage] = useState<BuilderContent>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const isEditingOrPreviewing = Builder.isEditing || Builder.isPreviewing;

  useEffect(() => {
    const fetchPage =  async () => {
      setLoading(true);
      const content = await builder.get('page', { url: history.location.pathname }).toPromise();
      // @ts-ignore
      setPage(content);
      setLoading(false);
    }
   if (!isEditingOrPreviewing) {
     fetchPage();
   }
  }, [history.location.pathname, isEditingOrPreviewing])

  if (loading) {
    return <Loading loading />
  }
  // @ts-ignore
  return <BuilderComponent model="page" content={pageJson} />

}

export default CatchAllPage;
