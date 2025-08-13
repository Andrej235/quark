using FluentResults;

namespace Quark.Errors;

public class Forbidden(string message) : Error(message) { }
