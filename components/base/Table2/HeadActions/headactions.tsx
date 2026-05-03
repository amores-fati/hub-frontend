import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import IconButton from '@mui/material/IconButton';
import { TableActionColumnConfig, resolveVisibility } from '../../Table/table';

type HeadActionsProps<T> = {
    row: T;
    actionColumnConfig: TableActionColumnConfig<T>;
};

export default function HeadActions<T>({
    row,
    actionColumnConfig,
}: HeadActionsProps<T>) {
    return (
        <td>
            <div className='custom-table__actions'>
                {resolveVisibility(actionColumnConfig.showWhatsapp, row) &&
                    actionColumnConfig.getWhatsappHref && (
                        <IconButton
                            className='custom-table__action-button'
                            component='a'
                            href={actionColumnConfig.getWhatsappHref(row)}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <WhatsAppIcon fontSize='small' />
                        </IconButton>
                    )}

                {resolveVisibility(actionColumnConfig.showView, row) &&
                    actionColumnConfig.onView && (
                        <IconButton
                            className='custom-table__action-button'
                            onClick={() => actionColumnConfig.onView?.(row)}
                        >
                            <VisibilityOutlinedIcon fontSize='small' />
                        </IconButton>
                    )}

                {resolveVisibility(actionColumnConfig.showEdit, row) &&
                    actionColumnConfig.onEdit && (
                        <IconButton
                            className='custom-table__action-button'
                            onClick={() => actionColumnConfig.onEdit?.(row)}
                        >
                            <EditOutlinedIcon fontSize='small' />
                        </IconButton>
                    )}

                {resolveVisibility(actionColumnConfig.showDelete, row) &&
                    actionColumnConfig.onDelete && (
                        <IconButton
                            className='custom-table__action-button custom-table__action-button--danger'
                            onClick={() => actionColumnConfig.onDelete?.(row)}
                        >
                            <DeleteOutlineRoundedIcon fontSize='small' />
                        </IconButton>
                    )}
            </div>
        </td>
    );
}
