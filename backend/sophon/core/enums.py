import enum


class SophonGroupAccess(enum.IntEnum):
    """
    The level of access an user has in a group.

    From the highest to the lowest:
    - Instance superuser
    - Group owner
    - Group member
    - Instance user
    - Anonymous user

    Since access levels are instance of an :class:`~enum.IntEnum`, they can be compared with ``==``, ``!=``, ``>``, ``<``, ``>=`` and ``<=``.
    """

    SUPERUSER = 200
    OWNER = 100
    MEMBER = 50
    REGISTERED = 10
    NONE = 0
