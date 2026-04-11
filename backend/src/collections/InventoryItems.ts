import { CollectionConfig } from 'payload';

export const InventoryItems: CollectionConfig = {
  slug: "inventory",
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ['nombre', "sku", "precio", "stock"],
  },
  fields: [
    { name: "nombre", type: "text", required: true },
    { name: "precio", type: "number", required: true },
    { name: "sku", type: "text", required: true },
    { name: "stock", type: "number", required: true },
    { name: "imagen", type: "upload", relationTo: "media" },
  ],
  timestamps: true
}