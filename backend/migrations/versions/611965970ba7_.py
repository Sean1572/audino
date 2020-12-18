"""empty message

Revision ID: 611965970ba7
Revises: fbf389ef5017
Create Date: 2020-12-01 11:01:05.140699

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '611965970ba7'
down_revision = 'fbf389ef5017'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    #op.add_column('data', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('data', sa.Column('assigned_user_id', sa.JSON(), nullable=False))
    pass
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('data', 'created_at')
    op.drop_column('data', 'assigned_user_id')
    # ### end Alembic commands ###
