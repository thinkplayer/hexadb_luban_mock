import classNames from 'classnames';
import styles from './index.module.less';
import shrinkIcon from '@/assets/images/shrinkTree-icon.png';
import { useState } from 'react';

interface ShrinkTreeProps {
	children?: any;
	hide?: boolean;
	toggle?: boolean;
	setToggle?: (t: boolean) => void;
}

const ShrinkTree = (props: ShrinkTreeProps) => {
	const { hide, toggle, setToggle } = props;
	const [closeTree, setCloseTree] = useState(false);
	const handleCloseTree = () => {
		if (setToggle) {
			setToggle(!toggle);
		}
		setCloseTree(!closeTree);
	};
	return (
		<div className={styles.ShrinkTreeWrap}>
			<div
				className={classNames(styles.ShrinkTree, {
					[styles.ShrinkTreeClose]: toggle !== undefined ? toggle : closeTree
				})}
			>
				{props.children}
				<img
					className={styles.closeIcon}
					src={shrinkIcon}
					alt="收起tree"
					onClick={handleCloseTree}
				/>
			</div>

			{(toggle !== undefined ? toggle : closeTree) && !hide && (
				<img
					className={styles.openIcon}
					src={shrinkIcon}
					alt="展开tree"
					onClick={handleCloseTree}
				/>
			)}
		</div>
	);
};

export default ShrinkTree;
