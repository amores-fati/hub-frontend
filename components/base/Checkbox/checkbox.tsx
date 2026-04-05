import MuiCheckbox from '@mui/material/Checkbox';
import './index.scss';

export default function Checkbox(
    { checked, indeterminate, onChange }:
        { checked: boolean, indeterminate?: boolean, onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <MuiCheckbox
            className='custom-checkbox'
            onChange={onChange}
            checked={checked}
            indeterminate={indeterminate}
        />
    )
}