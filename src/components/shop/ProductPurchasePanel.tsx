"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent } from "react";
import { ShoppingCart, Upload } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/format";
import type { BlogPost, CustomField, ProductOption, ProductOptionValue, ProductVariant } from "@/types/base44";

function findMatchingVariant(variants: ProductVariant[], selected: Record<string, string>) {
  const keys = Object.keys(selected);
  return variants.find((variant) =>
    keys.length > 0 && keys.every((key) => variant.option_values?.[key] === selected[key])
  );
}

function defaultSelections(options: ProductOption[] = []) {
  return Object.fromEntries(options.map((option) => [option.name, option.values[0]?.label]).filter(([, value]) => value));
}

function OptionButton({
  option,
  value,
  selected,
  onSelect,
}: {
  option: ProductOption;
  value: ProductOptionValue;
  selected: boolean;
  onSelect: () => void;
}) {
  if (option.type === "color") {
    return (
      <button type="button" onClick={onSelect} className="flex flex-col items-center gap-2 text-xs text-on-surface-variant">
        <span
          className={`h-9 w-9 rounded-full border-2 ${selected ? "border-primary" : "border-outline-variant"}`}
          style={{ backgroundColor: value.color || "#888" }}
          title={value.label}
        />
        {value.label}
      </button>
    );
  }

  if (option.type === "material") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`relative h-12 w-12 overflow-hidden rounded-md border-2 ${selected ? "border-primary" : "border-outline-variant"}`}
        title={value.label}
        style={{ backgroundColor: value.color || undefined }}
      >
        {value.image_url ? <Image src={value.image_url} alt={value.label} fill className="object-cover" /> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-full border px-4 py-2 text-sm font-bold ${
        selected ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface"
      }`}
    >
      {value.label}
    </button>
  );
}

function CustomFieldsForm({
  fields,
  values,
  files,
  onValue,
  onFile,
}: {
  fields: CustomField[];
  values: Record<string, string>;
  files: Record<string, string>;
  onValue: (label: string, value: string) => void;
  onFile: (label: string, value: string) => void;
}) {
  async function uploadFile(field: CustomField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/cms/upload", {
      method: "POST",
      body: formData,
    });
    const upload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !upload.url) throw new Error(upload.error || "Upload failed");
    onFile(field.label, upload.url);
  }

  if (!fields.length) return null;

  return (
    <div className="mt-8 space-y-5 border-t border-surface-container-high pt-6">
      <h2 className="font-headline text-xl font-bold">Personalization</h2>
      {fields.map((field) => (
        <label key={field.id} className="block">
          <span className="mb-2 block text-sm font-bold text-on-surface">
            {field.label}
            {field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <>
              <textarea
                required={field.required}
                maxLength={field.max_length}
                placeholder={field.placeholder}
                value={values[field.label] || ""}
                onChange={(event) => onValue(field.label, event.target.value)}
                className="min-h-28 w-full rounded-md border border-outline-variant bg-surface-container-low p-3 outline-none focus:border-primary"
              />
              {field.max_length ? <span className="text-xs text-on-surface-variant">{(values[field.label] || "").length}/{field.max_length}</span> : null}
            </>
          ) : field.type === "select" ? (
            <select
              required={field.required}
              value={values[field.label] || ""}
              onChange={(event) => onValue(field.label, event.target.value)}
              className="w-full rounded-md border border-outline-variant bg-surface-container-low p-3 outline-none focus:border-primary"
            >
              <option value="">Choose an option</option>
              {field.options?.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : field.type === "file" ? (
            <div className="flex items-center gap-3">
              <input required={field.required && !files[field.label]} accept={field.accept} type="file" onChange={(event) => uploadFile(field, event)} />
              {files[field.label] ? <Upload className="h-4 w-4 text-primary" /> : null}
            </div>
          ) : (
            <input
              required={field.required}
              type={field.type}
              maxLength={field.max_length}
              placeholder={field.placeholder}
              value={values[field.label] || ""}
              onChange={(event) => onValue(field.label, event.target.value)}
              className="w-full rounded-md border border-outline-variant bg-surface-container-low p-3 outline-none focus:border-primary"
            />
          )}
          {field.help_text ? <span className="mt-1 block text-xs text-on-surface-variant">{field.help_text}</span> : null}
        </label>
      ))}
    </div>
  );
}

export function ProductPurchasePanel({ product, variants }: { product: BlogPost; variants: ProductVariant[] }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() => defaultSelections(product.options));
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [customizationFiles, setCustomizationFiles] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(() => findMatchingVariant(variants, selected) || variants[0], [selected, variants]);
  const price = variant?.price ?? product.sale_price ?? product.price ?? 0;
  const stock = variant?.stock ?? product.stock ?? 0;
  const image = variant?.image_url || product.product_images?.[0]?.url || product.featured_image_url || "";
  const title = variant ? `${product.title} - ${variant.title}` : product.title;
  const canAdd = !product.track_inventory || stock > 0;

  function submit() {
    addItem({
      productId: product.id,
      variantId: variant?.id || null,
      title,
      image,
      price,
      sku: variant?.sku || product.sku,
      customization,
      customizationFiles,
      quantity,
    });
  }

  return (
    <div className="rounded-lg border border-surface-container-high bg-surface-container-low p-6">
      <p className="text-sm uppercase tracking-widest text-primary">{product.vendor || product.product_type || "Product"}</p>
      <h1 className="mt-3 font-headline text-3xl font-bold uppercase md:text-4xl">{product.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl font-bold text-secondary">{formatCurrency(price)}</span>
        {variant?.compare_at_price ? <span className="text-on-surface-variant line-through">{formatCurrency(variant.compare_at_price)}</span> : null}
      </div>
      <p className={`mt-3 text-sm ${canAdd ? "text-secondary" : "text-error"}`}>{canAdd ? `${stock} in stock` : "Out of stock"}</p>

      <div className="mt-8 space-y-6">
        {product.options?.map((option) => (
          <div key={option.id}>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider">{option.name}</p>
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => (
                <OptionButton
                  key={value.label}
                  option={option}
                  value={value}
                  selected={selected[option.name] === value.label}
                  onSelect={() => setSelected((current) => ({ ...current, [option.name]: value.label }))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {product.is_customizable ? (
        <CustomFieldsForm
          fields={product.custom_fields || []}
          values={customization}
          files={customizationFiles}
          onValue={(label, value) => setCustomization((current) => ({ ...current, [label]: value }))}
          onFile={(label, value) => setCustomizationFiles((current) => ({ ...current, [label]: value }))}
        />
      ) : null}

      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-surface-container-high bg-surface-container-low p-6 md:static md:mx-0 md:border-0 md:p-0">
        <div className="mb-4 flex w-32 items-center rounded-md border border-outline-variant">
          <button type="button" className="w-10 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
          <span className="flex-1 text-center">{quantity}</span>
          <button type="button" className="w-10 py-2" onClick={() => setQuantity((value) => value + 1)}>+</button>
        </div>
        <button
          type="button"
          disabled={!canAdd}
          onClick={submit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-bold uppercase text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
