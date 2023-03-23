import {
	Controller,
	Get,
	Patch,
	Put,
	Post,
	Delete,
	Param,
	Body
} from '@nestjs/common'
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return await this.categoryService.getAll()
	}

	@Get('/by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.categoryService.bySLug(slug)
	}

	@Get('/byId/:id')
	async getById(@Param('id') id: number) {
		return await this.categoryService.byId(id)
	}

	@Put(':id')
	async updateCategory(@Param('id') id: number, @Body() dto: CategoryDto) {
		return await this.categoryService.update(Number(id), dto)
	}

	@Post()
	async createCategory() {
		return await this.categoryService.create()
	}

	@Delete(':id')
	async deleteCategory(@Param('id') id: number) {
		return await this.categoryService.delete(Number(id))
	}
}
