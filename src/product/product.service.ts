import { Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto'
import {
	productReturnObject,
	productReturnObjectFullest
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private paginationService: PaginationService,
		private prisma: PrismaService
	) {}

	async getAll(dto: GetAllProductDto) {
		const { searchTerm, sort } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort == EnumProductSort.LOW_PRICE) {
			prismaSort.push({ price: 'asc' })
		} else if (sort == EnumProductSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' })
		} else if (sort == EnumProductSort.OLDEST) {
			prismaSort.push({ createdAt: 'asc' })
		} else {
			prismaSort.push({ createdAt: 'desc' })
		}
		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							},
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							},
							descirption: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
			  }
			: {}
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter
			})
		}
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id
			},
			select: productReturnObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')
		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug
			},
			select: productReturnObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')
		return product
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: productReturnObjectFullest
		})
		if (!products) throw new NotFoundException('Product not found')
		return products
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)
		if (!currentProduct)
			throw new NotFoundException('Current product not found')

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}
}
