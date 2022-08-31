import numpy as np
# import matplotlib.pyplot as plt
from scipy.stats import norm


def create_prior():
    """
    Create a 3-D prior distribution.
    """

    x = np.arange(-3.03, 3.09, 0.06)
    y = norm.cdf(x, loc=0, scale=1)
    y = np.diff(y)

    distribution = y.reshape(-1, 1) @ y.reshape(1, -1)
    distribution = distribution.reshape(101, 101, 1)

    return distribution


def create_posteriors(posterior):
    """
    Create splited distributions from a 3-D posterior distribution.
    """
    user = posterior.sum(axis=1).sum(axis=-1).reshape(-1, 1)
    recipe = posterior.sum(axis=0).sum(axis=-1).reshape(1, -1)
    return user, recipe


def create_condional():
    """
    Create a 3-D conditional probabilities.
    """

    x = np.arange(-3, 3.01, 0.06)
    x = np.tile(x, (101, 1))
    x = ((x - x.T) / 2).reshape(101, 101, 1)

    score = np.arange(-3.5, 4.5, 1.5)
    score = np.tile(score, (101, 101, 1))

    conditional = norm.cdf(x, loc=score, scale=1)
    conditional = -np.diff(conditional, axis=2)

    # それぞれの条件付き確率の合計を1に正規化
    conditional /= conditional.sum(axis=2).reshape(101, 101, 1)

    return conditional


def update(prior, conditional, num):

    # P(E|A) * P(A)
    event = conditional * prior

    # P(E)
    event_all = event.sum(axis=0).sum(axis=0)
    event_all = np.tile(event_all, (101, 101, 1))

    # P(A|E) = P(E|A) * P(A) / P(E)
    posterior = event / event_all
    posterior = posterior[..., num].reshape(101, 101, 1)

    return posterior


# def plot(distribution, x_label, y_label):
#     plt.imshow(distribution * 100)  # 単位を%に変換
#     plt.title('distribution (%)')
#     plt.xlabel(x_label)
#     plt.ylabel(y_label)
#     plt.colorbar()
#     plt.show()
#     return None
