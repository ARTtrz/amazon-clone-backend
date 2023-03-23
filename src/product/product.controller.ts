import {
	Controller,
	Get,
	Post,
	Put,
	Patch,
	Delete,
	Param,
	Body,
	Query,
	ValidationPipe,
	HttpCode,
	UsePipes
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllProductDto } from './dto/getAllProduct.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: number) {
		return this.productService.getSimilar(id)
	}

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:category')
	async getProductBycategory(@Param('category') category: string) {
		return this.productService.byCategory(category)
	}
}
