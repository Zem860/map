import { Label } from "@radix-ui/react-label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { SearchData } from "@/type/product";


type Props = {
    searchData?: SearchData
    categories:string[]
    onCategoryChange: (category: string) => void
}
const CategoryPicker = ({ searchData, onCategoryChange,categories }: Props) => {

    return (<>
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
                value={searchData?.category}
                onValueChange={(value) => { value === "all" ? onCategoryChange("") : onCategoryChange(value) }}
            >
                <SelectTrigger id="category">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </>
    )
}

export default CategoryPicker
