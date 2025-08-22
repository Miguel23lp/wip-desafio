import {
    FormControl,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown } from "lucide-react"
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form"

export default function SearchableDropdownWithId({ options, field, form, label }: { options: { id: string, value: string }[], field: ControllerRenderProps<any>, form: UseFormReturn<any>, label: string }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="secondary"
                        role="combobox"
                        className={cn(
                            "w-50 justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {options.find(option => option.id === field.value)?.value || `Insira o ${label}...`}
                        <ChevronDown className="opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0">
                <Command>
                    <CommandInput placeholder={`Pesquisar ${label}...`} />
                    <CommandList>
                        <CommandEmpty>{ `Nenhum ${label} encontrado.`}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option, i) => (
                                <CommandItem
                                    value={option.value}
                                    key={i}
                                    onSelect={() => {
                                        form.setValue(field.name, option.id)
                                    }}
                                >
                                    {option.value}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            option.id === field.value
                                                ? ""
                                                : "hidden"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
