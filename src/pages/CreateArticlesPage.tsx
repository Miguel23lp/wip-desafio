import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm, useWatch } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import SearchableDropdown from "@/SearchableDropdown"
import SearchableDropdownWithId from "@/SearchableDropdownWithId"

let kinds: string[] = [
    "PM",
    "PK",
    "AC",
    "KS"
]

const customers: { [key: string]: string }[] = [
    { "001": "WIP" },
    { "025": "IPCA" }
]

const certifications: { [key: string]: string }[] = [
    { "001": "GOTS" },
    { "002": "BLUE" },
    { "003": "GREEN" }
]

const units: { [key: string]: string }[] = [
    { "001": "UN" },
    { "002": "PK" },
    { "003": "PAIR" }
]

const currencies: { [key: string]: string }[] = [
    { "001": "EUR" },
    { "002": "USD" },
    { "003": "JPY" },
    { "004": "GBP" }
]

const sustainableComps: { [key: string]: string }[] = [
    { "001": "ECO" },
    { "002": "WOOL" },
    { "003": "GRTXT" },
]

const brandsPerCustomer: { [key: string]: { [key: string]: string }[] } = {
    "001": [
        { "001": "WIPTech Pro" },
        { "253": "WIPTech Ultra" },
        { "563": "WIPTech Standard" },
    ],
    "025": [
        { "009": "IPCA 1" },
        { "632": "IPCA 2" },
    ]
}

const colorsPerBrand: { [key: string]: { [key: string]: string }[] } = {
    "001": [
        { "002": "Pure Red" },
        { "006": "Soft White" },
        { "009": "Sunset Orange" },
    ],
    "253": [
        { "025": "Pure Red" },
        { "085": "Soft White" },
    ],
    "563": [
        { "001": "Black" },
        { "002": "White" },
    ],
    "009": [
        { "001": "Green" },
        { "002": "White" },
    ],
    "632": [
        { "001": "Green" },
        { "002": "White" },
    ]

}


const mapIds = (arr: { [key: string]: string }[]) => {
    return arr.map(item => {
        const id = Object.keys(item)[0];
        const value = item[id];
        return { id, value };
    });
}

const FormSchema = z.object({
    kind: z.string().nonempty("Por favor selecione o Tipo"),
    nPairs: z.coerce.number().int().min(1, "Por favor insira o número de pares").max(99, "Número máximo de pares é 99"),
    customerId: z.string().nonempty("Por favor insira o Cliente."),
    colorId: z.string().nonempty("Por favor insira a Cor."),
    certificationId: z.string().nonempty("Por favor insira a Certificação."),
    packsPerBox: z.string().optional(),
    coefficientPerBox: z.coerce.number().optional().default(0),
    brandId: z.string().nonempty("Por favor insira a Marca."),
    size: z.string().optional(),
    description: z.string().optional(),
    customerRef: z.string().optional(),
    csStyleRef: z.string().optional(),
    customerBarcode: z.string().optional(),
    wheight: z.coerce.number().optional(),
    measures1: z.coerce.number().optional(),
    measures2: z.coerce.number().optional(),
    measures3: z.coerce.number().optional(),
    unitId: z.string().optional(),
    price: z.coerce.number().optional(),
    currencyId: z.string().optional(),
    sustainableComp: z.coerce.number().int().optional()
})

export default function CreateArticlesPage() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })


    const kind = useWatch({
        control: form.control,
        name: "kind",
    })
    const customerId = useWatch({
        control: form.control,
        name: "customerId",
    })
    const brandId = useWatch({
        control: form.control,
        name: "brandId",
    })

    const nPairs = useWatch({
        control: form.control,
        name: "nPairs",
    })

    const coefficientPerBox = useWatch({
        control: form.control,
        name: "coefficientPerBox",
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("You submitted the following values: ", data);
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 pt-10 flex flex-col gap-3">
                <hr />
                <p>Criação, Registo e Verificação de Códigos de Artigos / Article Codes Creation, Verification and Registration</p>

                <FormField
                    control={form.control}
                    name="kind"
                    render={({ field }) => (
                        <FormItem className="flex">
                            <FormLabel>Tipo / Kind</FormLabel>
                            <SearchableDropdown
                                options={kinds}
                                field={field}
                                form={form}
                                label="tipo"
                            />
                        </FormItem>
                    )}
                />

                <div className={kind == "PK" ? "contents" : "hidden"}>
                    <p>{"> Packs de Meias / Packs Assortment Socks >"}</p>
                    <div className="flex justify-between ">
                        {/* Lado esquerdo */}
                        <div className="flex flex-col gap-3 flex-1">
                            <FormField
                                control={form.control}
                                name="nPairs"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Nº Pares / Nr. Pairs</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-50"
                                                type="number"
                                                step={1}
                                                min={1}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customerId"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Cliente / Customer</FormLabel>
                                        <SearchableDropdownWithId
                                            options={mapIds(customers)}
                                            field={field}
                                            form={form}
                                            label="cliente"
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                disabled={!brandId}
                                control={form.control}
                                name="colorId"
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormLabel>Cor - Sortimento / Color - Assortment</FormLabel>
                                        <SearchableDropdownWithId
                                            options={mapIds(colorsPerBrand[brandId] || [])}
                                            field={field}
                                            form={form}
                                            label="cor"
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="certificationId"
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormLabel>Certificação / Certification</FormLabel>
                                        <SearchableDropdownWithId
                                            options={mapIds(certifications)}
                                            field={field}
                                            form={form}
                                            label="certificação"
                                        />
                                    </FormItem>
                                )}
                            />

                        </div>
                        {/* Lado direito */}
                        <div className="flex flex-col gap-3 flex-1">
                            <div className="flex gap-1">

                                <FormField
                                    control={form.control}
                                    name="packsPerBox"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel>Packs p/Cx. / Packs per Box</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-15"
                                                    type="number"
                                                    step={1}
                                                    min={0}
                                                    defaultValue={0}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coefficientPerBox"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel>Coeficiente p/Cx. / Coefficient per Box</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-50"
                                                    type="number"
                                                    min={0}
                                                    defaultValue={0}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                disabled={!customerId}
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormLabel>Marca / Brand</FormLabel>
                                        <SearchableDropdownWithId
                                            options={mapIds(brandsPerCustomer[customerId] || [])}
                                            field={field}
                                            form={form}
                                            label="marca"
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormLabel>Tamanho / Size</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-50"
                                                type="number"
                                                step={1}
                                                min={1}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                        </div>

                    </div>
                </div>

                <Button type="submit" className="w-50 self-end mt-5">
                    Gravar
                </Button>

            </form>
        </Form>

    );
}
