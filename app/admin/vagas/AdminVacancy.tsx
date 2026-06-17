.admin-vagas {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    width: 100%;
    max-width: 100%;
    flex: 1 1 auto;
    align-self: stretch;
    min-width: 0;
    box-sizing: border-box;

    &__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;

        h1 {
            margin: 0;
            font: var(--titulo-2);
        }
    }

    &__eyebrow {
        display: block;
        font: var(--footnote-bold);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--tertiary-color);
        margin-bottom: 0.25rem;
    }

    &__bulk-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: color-mix(in srgb, var(--tertiary-color) 12%, var(--surface));
        border: 1px solid color-mix(in srgb, var(--tertiary-color) 35%, var(--surface));
        border-radius: var(--border-radius);
        padding: var(--spacing-sm) var(--spacing-lg);
        gap: var(--spacing-md);
    }

    &__bulk-bar-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);

        strong {
            font: var(--subhead);
            color: var(--tertiary-color);
        }
    }

    &__bulk-divider {
        width: 1px;
        height: 1.25rem;
        background: var(--tertiary-color);
        opacity: 0.4;
    }

    &__bulk-export {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        background: none;
        border: none;
        cursor: pointer;
        font: var(--footnote-bold);
        color: var(--tertiary-color);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        transition: background var(--transition-fast);

        &:hover {
            background: color-mix(in srgb, var(--tertiary-color) 15%, transparent);
        }
    }

    &__bulk-close {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--tertiary-color);
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        transition: background var(--transition-fast);

        &:hover {
            background: color-mix(in srgb, var(--tertiary-color) 15%, transparent);
        }
    }

    &__table-card {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        background: var(--surface);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
    }

    &__empty-state {
        padding: var(--spacing-3xl) var(--spacing-xl);
        text-align: center;

        h2 {
            font: var(--heading);
            color: var(--text-primary);
            margin: 0;
        }
    }

    &__title-cell {
        font-weight: 500;
        color: var(--text-primary);
    }

    &__badge {
        font: var(--footnote-bold) !important;
        height: 24px !important;
        border-radius: var(--border-radius-sm) !important;

        &--success {
            background-color: var(--success) !important;
            color: var(--preto-2) !important;
        }

        &--danger {
            background-color: var(--error) !important;
            color: var(--preto-2) !important;
        }

        &--info {
            background-color: var(--info) !important;
            color: var(--preto-2) !important;
        }

        &--presencial {
            background-color: var(--secondary-color) !important;
            color: var(--branco) !important;
        }

        &--online {
            background-color: var(--warning) !important;
            color: var(--preto-2) !important;
        }

        &--hibrido {
            background-color: var(--tertiary-color) !important;
            color: var(--branco) !important;
        }
    }
}

.admin-vagas__table-card--no-default-pagination {
    .sass-paginator {
        display: none;
    }
}

.admin-vagas__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.admin-vagas__pagination-info {
    font: var(--footnote);
    color: var(--text-muted);
}

.admin-vagas__pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.admin-vagas__pagination-btn {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    padding: 0.375rem 0.625rem;
    font: var(--footnote);
    cursor: pointer;
    color: var(--text-primary);
    transition: all var(--transition-fast);
    min-width: 36px;

    &:hover:not(:disabled) {
        border-color: var(--tertiary-color);
        color: var(--tertiary-color);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

.admin-vagas__pagination-btn--active {
    background: var(--tertiary-color);
    border-color: var(--tertiary-color);
    color: var(--branco);
    font-weight: 600;
}
