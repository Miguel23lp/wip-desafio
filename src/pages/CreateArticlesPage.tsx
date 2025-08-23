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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import SearchableDropdown from "@/SearchableDropdown"
import SearchableDropdownWithId from "@/SearchableDropdownWithId"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { useEffect, useState } from "react"

const mapIds = (arr: { [key: string]: string }[]) => {
    return arr.map(item => {
        const id = Object.keys(item)[0];
        const value = item[id];
        return { id, value };
    });
}

const FormSchema = z.object({
    kind: z.string().nonempty("Por favor selecione o Tipo"),
    nPairs: z.coerce.number().int().min(1).max(99),
    customerId: z.string().nonempty("Por favor insira o Cliente."),
    colorId: z.string().nonempty("Por favor insira a Cor."),
    certificationId: z.string().nonempty("Por favor insira a Certificação."),
    packsPerBox: z.coerce.number().optional(),
    coefficientPerBox: z.coerce.number().optional(),
    brandId: z.string().nonempty("Por favor insira a Marca."),
    size: z.coerce.number().int().min(1).max(99),
    description: z.string().optional(),
    customerRef: z.string().optional(),
    csStyleRef: z.string().optional(),
    customerBarcode: z.string().optional(),
    weight: z.coerce.number().positive().optional(),
    boxWeight: z.coerce.number().positive().optional(),
    measures1: z.coerce.number().positive().optional(),
    measures2: z.coerce.number().positive().optional(),
    measures3: z.coerce.number().positive().optional(),
    unitId: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    currencyId: z.string().optional(),
    sustainableCompId: z.coerce.number().int().optional(),
    code: z.string().optional(),
})

export default function CreateArticlesPage() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const kind = useWatch({
        control: form.control,
        name: "kind",
    },)
    const customerId = useWatch({
        control: form.control,
        name: "customerId",
    })
    const brandId = useWatch({
        control: form.control,
        name: "brandId",
    })

    const [kinds, setKinds] = useState<string[]>([]);
    const [customers, setCustomers] = useState<{ id: string, value: string }[]>([]);
    const [certifications, setCertifications] = useState<{ id: string, value: string }[]>([]);
    const [units, setUnits] = useState<{ id: string, value: string }[]>([]);
    const [currencies, setCurrencies] = useState<{ id: string, value: string }[]>([]);
    const [sustComps, setSustComps] = useState<{ id: string, value: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string, value: string }[]>([]);
    const [colors, setColors] = useState<{ id: string, value: string }[]>([]);

    useEffect(() => {
        axios.get("/kinds").then(function (response) {
            console.log("/kinds", response.data);
            if (!response.data.success) return;
            setKinds(response.data.data);
        });
    }, []);

    useEffect(() => {
        form.resetField("customerId");
        form.resetField("certificationId");
        form.resetField("unitId");
        form.resetField("currencyId");
        form.resetField("sustainableCompId");
        setCustomers([]);
        setCertifications([]);
        setUnits([]);
        setCurrencies([]);
        setSustComps([]);

        if (!kind) return;

        axios.get(`/create/${kind}`).then(function (response) {
            console.log(`/create/${kind}`, response.data);
            if (!response.data.success) return;
            setCustomers(mapIds(response.data.customer));
            setCertifications(mapIds(response.data.certification));
            setUnits(mapIds(response.data.unit));
            setCurrencies(mapIds(response.data.currency));
            setSustComps(mapIds(response.data.sustComp));
        });
    }, [kind]);

    useEffect(() => {
        form.resetField("brandId");
        setBrands([]);
        form.resetField("colorId");
        setColors([]);
        if (!customerId) return;
        axios.get(`/customer/${customerId}/brands`).then(function (response) {
            console.log(`/customer/${customerId}/brands`, response.data);
            if (!response.data.success) return;
            setBrands(mapIds(response.data.data));
        });
    }, [customerId]);

    useEffect(() => {
        form.resetField("colorId");
        setColors([]);
        if (!brandId) return;
        axios.get(`/brand/${brandId}/colors`).then(function (response) {
            console.log(`/brand/${brandId}/colors`, response.data);
            if (!response.data.success) return;
            setColors(mapIds(response.data.data));
        });
    }, [brandId]);

    function onSubmit(data: z.infer<typeof FormSchema>) {

        toast.message("Submeteu os seguintes dados:", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        console.log("Dados: ", data);
        form.reset();
    }

    function createCode() {
        let code = [
            form.getValues("kind"),
            form.getValues("nPairs").toString().padStart(3, '0'),
            form.getValues("customerId"),
            form.getValues("brandId"),
            form.getValues("colorId"),
            form.getValues("size").toString().padStart(3, '0'),
            form.getValues("certificationId"),
        ].join("");


        form.setValue("code", code);

        console.log("Generated Code: ", code);
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full h-full">

                {/*Cima / Conteudo principal*/}
                <div className="p-5 pt-16 flex flex-col gap-4 h-full">

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

                    <div className={kind == "PK" ? "contents relative" : "hidden"}>
                        <p>{"> Packs de Meias / Packs Assortment Socks >"}</p>
                        <div className="flex justify-between ">
                            {/* Lado esquerdo */}
                            <div className="flex flex-col gap-4 flex-1">
                                <FormField
                                    control={form.control}
                                    name="nPairs"
                                    render={({ field }) => (
                                        <FormItem className="flex">
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
                                        <FormItem className="flex">
                                            <FormLabel>Cliente / Customer</FormLabel>
                                            <SearchableDropdownWithId
                                                options={customers}
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
                                                options={colors}
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
                                                options={certifications}
                                                field={field}
                                                form={form}
                                                label="certificação"
                                            />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            {/* Lado direito */}
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex gap-3">

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
                                                options={brands}
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

                        <hr />

                        <div className="flex justify-between ">
                            <div className="flex flex-col gap-4 w-[40%]">

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel className="self-start mt-3">Descrição / Description</FormLabel>
                                            <Textarea
                                                className="resize-none h-40"
                                                {...field}
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customerRef"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel>Ref. do Cliente / Customer Ref.</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="csStyleRef"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel>CS Style Ref.</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3">
                                    <FormField
                                        control={form.control}
                                        name="customerBarcode"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel>Customer Barcode EAN13</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel>Peso / Weight - PK</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">GR</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="flex gap-3">
                                    <FormField
                                        control={form.control}
                                        name="boxWeight"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel>Peso Cx/ Box Weight</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">Kg</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name="measures1"
                                            render={({ field }) => (
                                                <FormItem className="flex">
                                                    <FormLabel>Medidas Cx / Box Measures</FormLabel>
                                                    <FormControl className="w-16">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="measures2"
                                            render={({ field }) => (
                                                <FormItem className="flex">

                                                    <FormLabel>x</FormLabel>
                                                    <FormControl className="w-16">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="measures3"
                                            render={({ field }) => (
                                                <FormItem className="flex">

                                                    <FormLabel>x</FormLabel>
                                                    <FormControl className="w-16">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">cm</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">

                                    <FormField
                                        control={form.control}
                                        name="unitId"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel className="self-start mt-3">Unidade / Unit</FormLabel>
                                                <SearchableDropdownWithId

                                                    options={units}
                                                    field={field}
                                                    form={form}
                                                    label="Unidade"
                                                />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel className="self-start mt-3">Preço Un / Un Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="w-24"
                                                        type="number"
                                                        min={0}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currencyId"
                                        render={({ field }) => (
                                            <FormItem className="flex">
                                                <FormLabel className="self-start mt-3">Moeda / Currency</FormLabel>
                                                <SearchableDropdownWithId
                                                    options={currencies}
                                                    field={field}
                                                    form={form}
                                                    label="Moeda"
                                                />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <FormField
                                    control={form.control}
                                    name="sustainableCompId"
                                    render={({ field }) => (
                                        <FormItem className="flex">
                                            <FormLabel>Sustainable Comp.</FormLabel>
                                            <SearchableDropdownWithId
                                                options={sustComps}
                                                field={field}
                                                form={form}
                                                label="Sustainable Comp."
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>


                        <div className="self-end">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="flex">
                                        <FormLabel>Código Gerado / New Code Created</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-50"
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (form.formState.isValid) {
                                                    createCode()
                                                }
                                                else {
                                                    form.trigger();
                                                }
                                            }}
                                        >
                                            Verificar / Verify
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                </div>

                {/*Baixo*/}
                <div className="flex absolute bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300 flex-col gap-3">
                    <Button type="submit" className="self-end w-50 m-5">
                        Gravar
                    </Button>
                </div>
            </form>
        </Form>

    );
}
