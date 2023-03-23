import {
	Controller,
	Get,
	Post,
	Put,
	Patch,
	Param,
	Body,
	UsePipes
} from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDto } from './review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get()
	async getAll() {
		return await this.reviewService.getAll()
	}

	@UsePipes(new ValidationPipe())
	@Post('leave/:productId')
	@Auth()
	async leaveReview(
		@CurrentUser('id') id: number,
		@Body() dto: ReviewDto,
		@Param('productId') productId: number
	) {
		return await this.reviewService.create(id, dto, productId)
	}

	@Get('average/:productId')
	async getAvg(@Param('productId') productId: number) {
		return await this.reviewService.getAverageValueByProductId(productId)
	}
}
