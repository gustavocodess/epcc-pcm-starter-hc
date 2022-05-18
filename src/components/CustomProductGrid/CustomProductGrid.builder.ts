import { Builder } from '@builder.io/react';
import { CustomProductGrid } from './CustomProductGrid';

export const CustomProductGridBuilderConfig = {
  name: 'Custom Product Grid',
  image: 'https://cdn.builder.io/api/v1/image/assets%2F1fa6810c36c54e87bfe1a6cc0f0be906%2F7126293c000b4a33aa60813613e50d3e',
  inputs: [
    {
      name: 'products list',
      type: 'ElasticpathPCMProductsList',
      required: true,
    },
  ],
};
Builder.registerComponent(CustomProductGrid, CustomProductGridBuilderConfig);
