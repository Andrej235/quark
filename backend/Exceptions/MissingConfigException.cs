namespace Quark.Exceptions;

[Serializable]
public class MissingConfigException : Exception
{
    public MissingConfigException() { }

    public MissingConfigException(string message)
        : base(message) { }

    public MissingConfigException(string message, Exception inner)
        : base(message, inner) { }
}
