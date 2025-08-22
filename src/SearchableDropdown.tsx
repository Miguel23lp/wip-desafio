import type { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import SearchableDropdownWithId from "./SearchableDropdownWithId"

export default function SearchableDropdown({ options, field, form, label }: { options: string[], field: ControllerRenderProps<any>, form: UseFormReturn<any>, label: string }) {
    return (
        <SearchableDropdownWithId options={options.map(option => ({ id: option, value: option }))} field={field} form={form} label={label} />
    )
}
