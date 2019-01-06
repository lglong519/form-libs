export default function generateQeuqryOptions (status) {
	if (!status) {
		return {};
	}
	if (status == 'pendding') {
		return {
			$or: [
				{
					status: 'pendding',
					void: false,
					active: true,
				},
				{
					status: 'resolve',
					updatedAt: {
						$lt: new Date(`${new Date().toLocaleDateString()} 00:00`),
					},
					void: false,
					active: true,
				},
			],
		};
	}
	if (status == 'resolve') {
		return {
			updatedAt: {
				$gte: new Date(`${new Date().toLocaleDateString()} 00:00`),
			},
			status: 'resolve',
			void: false,
			active: true,
		};
	}
	if (status == 'resolve') {
		return {
			updatedAt: {
				$gte: new Date(`${new Date().toLocaleDateString()} 00:00`),
			},
			status: 'resolve',
			void: false,
			active: true,
		};
	}
	if (status == 'reject') {
		return {
			status: 'reject',
			void: false,
			active: true,
		};
	}
	if (status == 'void') {
		return {
			void: true,
			active: true,
		};
	}
	if (status == 'unactive') {
		return {
			active: false,
		};
	}
	return {};
}

export const searchProps = [
	{
		status: '',
		label: '全部'
	},
	{
		status: 'pendding',
		label: '待签'
	},
	{
		status: 'resolve',
		label: '已签'
	},
	{
		status: 'reject',
		label: '出错'
	},
	{
		status: 'void',
		label: '忽略',
	},
	{
		status: 'unactive',
		label: '无效',
	},
];
