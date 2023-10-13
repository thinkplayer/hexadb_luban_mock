import { CSSProperties, ReactNode, memo, useMemo } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import styles from './index.module.less';
import { Trigger, TriggerProps } from '@arco-design/web-react';
import classNames from 'classnames';
import { renderToString } from 'react-dom/server';
import { useMemoizedFn } from 'ahooks';

type LubanTooltipProps = Omit<TriggerProps, 'popup'> & {
	children: ReactNode;
	content: ReactNode;
	maxHeight?: number;
};

/**
 * 计算文本长度
 * @param text
 * @returns
 */
export function calcSize(node: ReactNode, style: CSSProperties) {
	if (!node) {
		return {
			width: 0,
			height: 0
		};
	}
	const span = document.createElement('span');
	span.style.position = 'absolute';
	span.style.top = '-9999999px';
	span.style.visibility = 'hidden';
	const html = renderToString(<div style={style}>{node}</div>);
	span.innerHTML = html;
	document.body.appendChild(span);
	const rect = span.getBoundingClientRect();
	document.body.removeChild(span);
	return { width: rect.width, height: rect.height };
}

const LubanTooltip = ({
	className,
	content,
	children,
	maxHeight = 500,
	...rest
}: LubanTooltipProps) => {
	const scrollContent = useMemo(() => {
		const size = calcSize(content, {
			maxWidth: 500
		});
		const { width, height } = size;
		if (height > maxHeight) {
			return (
				<div
					className={styles.lubanTooltipContent}
					style={{ width, height: maxHeight }}
				>
					<Scrollbars>{content}</Scrollbars>
				</div>
			);
		} else {
			return <div className={styles.lubanTooltipContent}>{content}</div>;
		}
	}, [content, maxHeight]);

	const getPopup = useMemoizedFn(() => {
		return scrollContent;
	});

	return (
		<Trigger
			showArrow
			arrowProps={{
				style: {
					background: 'var(--color-tooltip-bg)'
				}
			}}
			popup={getPopup}
			className={classNames(className, styles.lubanTooltip)}
			{...rest}
		>
			{children}
		</Trigger>
	);
};

export default memo(LubanTooltip);
