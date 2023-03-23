import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async getMain(userId: number) {
		const user = await this.userService.byId(userId, {
			orders: {
				select: {
					items: {
						select: {
							price: true
						}
					}
				}
			},
			reviews: true
		})

		return [
			{
				name: 'Orders',
				value: user.orders.length ? user.orders.length : 0
			},
			{
				name: 'Reviews',
				value: user.reviews.length ? user.reviews.length : 0
			},
			{ name: 'Favorites', value: user.favorites.length }
		]
	}
}
